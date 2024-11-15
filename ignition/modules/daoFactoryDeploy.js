const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DaoFactoryDeploy", (m) => {

    const daoManagement = m.contract("DaoManagement");
    
    const daoFactory = m.contract("DAOFactory", [daoManagement.target]);
    const dao1 = daoFactory.createDAO(
        ["mike", "0x68656c6c6f20776f726c64"],
        "0x0000000000000000000000000000000000000000",
        ["govName1", "govSymbol", "0x744ffD0001f411D781B6df6B828C76d32B65076E"],
        [45, 75, 86400, true, false],
        [
            ["0x744ffD0001f411D781B6df6B828C76d32B65076E", 500],
            ["0x10C01177B6F7DC0C31eDe50aa38A91B74ce0F081", 202],
            ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73", 203]
        ],
        [false, 0],
        true
    )

    return { daoFactory, dao1 };
});